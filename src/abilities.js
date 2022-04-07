import { defineAbility } from "@casl/ability";

export default function defineAbilitiesFor() {
  /*if (user == null || user.info == null || user.info.role == null) {
    return null;
  }*/
  
  return defineAbility((can) => {
    const role = 'Administrator';

    switch (role) {
      case 'Administrator':
        can('route', 'Orders');
        can('route', 'OrderDetails');
        can('route', 'Movements');
        can('route', 'MovementDetails');
        can('route', 'Items');
        can('route', 'ItemDetails');
        can('route', 'Profile');
        can('route', 'UploadTest');
        can('route', 'Stats');
        can('route', 'FileDetails');
        break;
      case 'Manager':
        can('route', 'Orders');
        can('route', 'OrderDetails');
        can('route', 'Movements');
        can('route', 'MovementDetails');
        can('route', 'Items');
        can('route', 'ItemDetails');
        can('route', 'Profile');
        can('route', 'UploadTest');
        can('route', 'Stats');
        can('route', 'FileDetails');
        break;
      case 'User':
        can('route', 'Profile');
        break;
    }
  });
}
