FROM ruby:3.2.2

WORKDIR /app

# Install system dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy application code
COPY . .

# Create and configure the entrypoint script
RUN echo '#!/bin/bash\nset -e\n\nbundle exec rails db:migrate\nexec "$@"' > /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["/usr/bin/entrypoint.sh"]
CMD ["sh", "-c", "bundle exec rails server -p ${PORT:-3000} -b 0.0.0.0"]