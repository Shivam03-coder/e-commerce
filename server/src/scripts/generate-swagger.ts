import generateSwagger from "@src/services/swagger";
import { appEnvConfigs } from "@src/configs";
import indexRoutes from "@src/routes/index.routes";

const PORT = Number(appEnvConfigs.PORT) || 3000;

async function main() {
  console.log("⏳ Generating Swagger documentation...");
  const success = await generateSwagger(PORT);

  if (success) {
    console.log(
      "✅ Swagger documentation generated successfully at ./swagger-output.json"
    );
  } else {
    console.error("❌ Failed to generate Swagger documentation");
    process.exit(1);
  }
}

main().catch(console.error);
