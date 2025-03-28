module ApiEndpoints
  class OpenApiImporter
    def initialize(project, open_api_spec)
      @project = project
      @spec = parse_spec(open_api_spec)
      @sections_cache = {}
    end

    def call
      validate_spec_structure!
      
      paths = @spec['paths'] || {}
      
      paths.each do |path, methods|
        methods.each do |http_method, endpoint_data|
          validate_endpoint_tags!(path, endpoint_data)
          section = find_or_create_section(endpoint_data['tags'])
          create_endpoint(path, http_method.upcase, endpoint_data, section)
        end
      end
    end

    private

    def validate_spec_structure!
      unless @spec['paths'].present?
        raise InvalidSpecError, 'OpenAPI specification must contain paths'
      end
    end

    def validate_endpoint_tags!(path, endpoint_data)
      unless endpoint_data['tags']&.any?
        raise InvalidSpecError, "Endpoint #{path} must have at least one tag to determine its section"
      end
    end

    def parse_spec(spec)
      return spec if spec.is_a?(Hash)
      
      # Try parsing as JSON first
      JSON.parse(spec)
    rescue JSON::ParserError
      begin
        # If JSON parsing fails, try YAML
        YAML.safe_load(spec, permitted_classes: [Date, Time])
      rescue Psych::SyntaxError => e
        raise InvalidSpecError, "Invalid specification format. Neither JSON nor YAML format is valid: #{e.message}"
      end
    end

    def find_or_create_section(tags)
      # Use the first tag as the section name
      tag_name = tags.first
      
      # Return from cache if already processed
      return @sections_cache[tag_name] if @sections_cache[tag_name]

      # Try to find existing section by title
      section = @project.sections.find_by(title: tag_name)

      unless section
        section = @project.sections.create!(
          title: tag_name,
        )
      end

      # Cache the section
      @sections_cache[tag_name] = section
      section
    end

    def create_endpoint(path, method, data, section)
      parameters = extract_parameters(data)
      request_body = extract_request_body(data)
      responses = extract_responses(data)
      endpoint_title = data['summary'] || data['operationId'] || "#{method} #{path}"
      ApiEndpoint.create!(
        project: @project,
        section: section,
        title: endpoint_title,
        slug: endpoint_title,
        endpoint_type: 'endpoint',
        content: data['description'],
        markdown: data['description'],
        body: {
          method: method,
          path: path,
          description: data['description'] || '',
          parameters: parameters,
          requestBody: request_body,
          authHeader: extract_auth_header(data),
          sampleResponses: responses
        }
      )
    end

    def extract_parameters(data)
      (data['parameters'] || []).map do |param|
        {
          name: param['name'],
          in: param['in'],
          required: param['required'] || false,
          description: param['description'] || '',
          type: param['schema']&.[]('type') || 'string'
        }
      end
    end

    def extract_request_body(data)
      return [] unless data['requestBody']

      content = data['requestBody']['content']
      schema = content&.dig('application/json', 'schema')
      return [] unless schema

      if schema['type'] == 'object' && schema['properties']
        schema['properties'].map do |name, property|
          {
            name: name,
            type: property['type'] || 'string',
            required: (schema['required'] || []).include?(name),
            description: property['description'] || ''
          }
        end
      else
        []
      end
    end

    def extract_responses(data)
      (data['responses'] || {}).map do |status_code, response_data|
        content = response_data['content']
        example = content&.dig('application/json', 'example')
        
        {
          statusCode: status_code.to_i,
          description: response_data['description'] || '',
          body: example ? example.to_json : '{}'
        }
      end
    end

    def extract_auth_header(data)
      security = data['security']&.first
      if security
        auth_type = security.keys.first
        {
          type: map_auth_type(auth_type),
          key: 'Authorization',
          value: ''
        }
      else
        {
          type: 'None',
          key: '',
          value: ''
        }
      end
    end

    def map_auth_type(auth_type)
      case auth_type
      when 'bearerAuth'
        'Bearer Token'
      when 'apiKey'
        'API Key'
      else
        'None'
      end
    end
  end

  class InvalidSpecError < StandardError; end
end 