import { ToDo, Item } from "./core.ts";

const file = process.argv[2];
const command = process.argv[3];

if (!file) {
  console.error("Informe o arquivo JSON.");
  process.exit(1);
}

const todo = new ToDo(file);

if (command === "add") {
  const description = process.argv[4];

  if (!description) {
    console.error("Informe a descrição.");
    process.exit(1);
  }

  await todo.addItem(new Item(description));
  console.log("Item adicionado!");
  process.exit(0);
}

if (command === "list") {
  const items = await todo.getItems();

  if (items.length === 0) {
    console.log("Lista vazia.");
    process.exit(0);
  }

  items.forEach((item, i) => {
    console.log(`${i}: ${item.toJSON().description}`);
  });

  process.exit(0);
}

if (command === "update") {
  const index = parseInt(process.argv[4]);
  const description = process.argv[5];

  if (isNaN(index) || !description) {
    console.error("Uso: update <index> <nova descrição>");
    process.exit(1);
  }

  try {
    await todo.updateItem(index, new Item(description));
    console.log("Item atualizado!");
  } catch (e: any) {
    console.error(e.message);
  }

  process.exit(0);
}

if (command === "remove") {
  const index = parseInt(process.argv[4]);

  if (isNaN(index)) {
    console.error("Uso: remove <index>");
    process.exit(1);
  }

  try {
    await todo.removeItem(index);
    console.log("Item removido!");
  } catch (e: any) {
    console.error(e.message);
  }

  process.exit(0);
}

console.error("Comando inválido.");
process.exit(1);