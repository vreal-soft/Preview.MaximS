set -e -u

echo Building task definition...

cp ecs-task-definition-template.json ecs-task-definition.json
aws ssm get-parameters-by-path --region=us-east-1 --recursive --path "/$ENV" | \
jq --raw-output '.Parameters[] | "\(.Name):\(.Value)"' | \
while IFS=: read -r key value; do
  key=${key/\/$ENV/}
  sed -i "s|%$key%|$value|g" ecs-task-definition.json
done

sed -i "s|%ENV%|$ENV|g" ecs-task-definition.json