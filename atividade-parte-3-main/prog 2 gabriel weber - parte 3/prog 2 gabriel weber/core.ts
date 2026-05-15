export class Item {
  private description: string;

  constructor(description: string) {
    this.description = description;
  }

  updateDescription(newDescription: string) {
    this.description = newDescription;
  }

  toJSON() {
    return {
      description: this.description
    };
  }
}

export class ToDo {
  private filepath: string;
  private items: Promise<Item[]>;

  constructor(filepath: string) {
    this.filepath = filepath;
    this.items = this.loadFromFile();
  }

  private async loadFromFile() {
    const file = Bun.file(this.filepath);

    if (!(await file.exists())) return [];

    const data = await file.text();

    return JSON.parse(data).map(
      (item: any) => new Item(item.description)
    );
  }

  private async saveToFile() {
    const items = await this.items;
    const data = JSON.stringify(items);
    await Bun.write(this.filepath, data);
  }

  async addItem(item: Item) {
    const items = await this.items;
    items.push(item);
    await this.saveToFile();
  }

  async getItems() {
    return await this.items;
  }

  async updateItem(index: number, newItem: Item) {
    const items = await this.items;

    if (index < 0 || index >= items.length) {
      throw new Error("Index inválido");
    }

    items[index] = newItem;
    await this.saveToFile();
  }

  async removeItem(index: number) {
    const items = await this.items;

    if (index < 0 || index >= items.length) {
      throw new Error("Index inválido");
    }

    items.splice(index, 1);
    await this.saveToFile();
  }
}