/**
 * Mock model class for testing DataServiceAbstract
 */
export class MockModel {
  id: number;
  name: string;
  items: any[] = [];
  tags: string[] = [];

  constructor() {
    this.id = 0;
    this.name = '';
    this.items = [];
    this.tags = [];
  }

  init(data: any): MockModel {
    if (data) {
      this.id = data.id || 0;
      this.name = data.name || '';
      this.items = data.items || [];
      this.tags = data.tags || [];
    }
    return this;
  }
}