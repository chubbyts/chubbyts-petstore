FROM fluent/fluentd:v1.18-1

# Use root account to use apk
USER root

# below RUN includes plugin as examples opensearch is not required
# you may customize including plugins as you wish
RUN apk add --no-cache --update --virtual .build-deps \
    sudo build-base ruby-dev \
    && sudo gem install fluent-plugin-opensearch \
    && sudo gem sources --clear-all \
    && apk del .build-deps \
    && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem

COPY docker/production/node-fluentd/files /

USER fluent
