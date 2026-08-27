#!/bin/bash -e

ONTOLOGY_GIT_TAG=${ONTOLOGY_GIT_TAG:-v4.2.2}

BASE_DIR="../../cypress/docker/ontology"
DSE_DIR="$BASE_DIR/dse"
MIGRATION_DIR="$BASE_DIR/migration"

mkdir -p "$BASE_DIR" "$DSE_DIR" "$MIGRATION_DIR"

echo "Downloading backend.zip for tag $ONTOLOGY_GIT_TAG..."
curl -fsSL -o "$BASE_DIR/backend.zip" \
  "https://github.com/medizininformatik-initiative/fhir-ontology-generator/releases/download/${ONTOLOGY_GIT_TAG}/backend.zip"

echo "Unzipping all files to ontology folder..."
unzip -oj -o "$BASE_DIR/backend.zip" -d "$BASE_DIR"

echo "Moving profile_tree.json to ontology/dse/ folder..."
mv "$BASE_DIR/profile_tree.json" "$DSE_DIR/" 2>/dev/null || true

echo "Moving SQL files to ontology/migration/ folder..."
mv "$BASE_DIR"/*.sql "$MIGRATION_DIR"/ 2>/dev/null || true

echo "Downloading elastic.zip for tag $ONTOLOGY_GIT_TAG..."
curl -fsSL -o "$BASE_DIR/elastic.zip" \
  "https://github.com/medizininformatik-initiative/fhir-ontology-generator/releases/download/${ONTOLOGY_GIT_TAG}/elastic.zip"

echo "Cleaning up zip..."
#rm "$BASE_DIR/backend.zip"

chmod 644 "$BASE_DIR"/*.zip
chmod 644 "$DSE_DIR"/* || true
chmod 644 "$MIGRATION_DIR"/* || true

echo "Final files:"
ls -l "$BASE_DIR"
ls -l "$DSE_DIR"
ls -l "$MIGRATION_DIR"
