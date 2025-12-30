
export interface Student {
  id: string;
  name: string;
}

export type ViewState = 'input' | 'picker' | 'grouper';

export interface Group {
  id: string;
  name: string;
  members: Student[];
  theme?: string;
}

export enum ThemeType {
  SPACE = '太空探險家',
  ANIMALS = '森林小動物',
  MYTHOLOGY = '遠古神話',
  SCIENCE = '科學元素',
  FRUITS = '繽紛水果'
}
