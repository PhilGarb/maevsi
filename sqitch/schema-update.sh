#!/bin/sh

THIS=$(dirname "$(readlink -f "$0")")
image=maevsi/maevsi-database-migrations

docker build -t "$image:build" --target build "$THIS" # --progress plain

container_id="$(docker create $image)"
docker cp "$container_id:/srv/schema.sql" "$THIS/schema.sql"
docker rm -v "$container_id"
