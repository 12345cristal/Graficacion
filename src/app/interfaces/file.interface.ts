export interface FileModel {
  id: number;
  name: string;
  type: 'pdf' | 'image' | 'document';
  size: string;
  date: string;
  url: string;
}
