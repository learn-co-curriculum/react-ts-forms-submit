// this file makes this NameFormData interface available in all files in the project
// by importing what's needed if we needed more global interfaces that get use multiple
// times throughout the project, we could add more in here using the same export syntax

export interface NameFormData {
  firstName: string;
  lastName: string;
}
