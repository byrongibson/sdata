#!/bin/sh

pg_dump \
  --host=$HOST \
  --port=$PORT \
  --username=postgres \
  --no-password \
  --schema-only \
  --clean sdata_dev > schema.sql
