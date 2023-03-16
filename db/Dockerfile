FROM mariadb:10

RUN chown -R mysql.mysql /var/lib/mysql
RUN chmod 755 /var/lib/mysql
RUN ls /var/lib/mysql

ARG TZ=UTC
ENV TZ ${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

VOLUME ["./data:/var/lib/mysql"]
