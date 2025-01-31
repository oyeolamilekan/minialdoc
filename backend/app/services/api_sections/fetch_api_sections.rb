module ApiSections
  class FetchApiSections < ApplicationService
    attr_accessor :project

    def initialize(project:)
      @project = project
    end

    def call
      [ :success, project.section ]
    end
  end
end
