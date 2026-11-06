export interface AdminSkillItemDto {
  id: string;
  categoryId: string;
  name: string;
  contextDescription: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface AdminSkillCategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isVisible: boolean;
  items: AdminSkillItemDto[];
}

export interface CreateSkillCategoryRequest {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface UpdateSkillCategoryRequest extends CreateSkillCategoryRequest {
  id: string;
}

export interface CreateSkillItemRequest {
  categoryId: string;
  name: string;
  contextDescription: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface UpdateSkillItemRequest extends CreateSkillItemRequest {
  id: string;
}

