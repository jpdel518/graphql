FROM mariadb:10

ARG TZ=UTC
ENV TZ ${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && chown -R mysql:root /var/lib/mysql/

COPY ./init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

VOLUME ["./data:/var/lib/mysql"]
