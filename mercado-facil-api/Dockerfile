# Ruby 3.2 for Rails API
FROM ruby:3.2.2-slim

RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 4.0.3 && \
    bundle _4.0.3_ config set --local without 'development test' && \
    bundle _4.0.3_ install -j4 --retry 3

COPY . .

# Run migrations at startup (Render runs this as start command, or we run server directly)
EXPOSE 3000
CMD ["sh", "-c", "bundle exec rails db:migrate && exec bundle exec rails server -b 0.0.0.0 -e production -p ${PORT:-3000}"]
