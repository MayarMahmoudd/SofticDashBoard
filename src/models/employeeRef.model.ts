export interface UserReference {
  name: string;
  rRelationShipID: number;
  telephone: string;
  fullAddress: string;
  nearBy: string;
  street: string;
  floor: number;
  unit: string;
  buildingNo: string;
  isEmployee: boolean;
  userId: number;
  refernceTypeId: number;
  id?: number
}
export interface EmployeeReferenceType {
  id?: number;
  name: string,
nameAr: string
}
