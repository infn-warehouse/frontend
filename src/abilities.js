import { defineAbility } from "@casl/ability";

export default function defineAbilitiesFor() {
  /*if (user == null || user.info == null || user.info.role == null) {
    return null;
  }*/
  
  return defineAbility((can) => {
    const role = 'Administrator';

    switch (role) {
      case 'Administrator':
        can('route', 'Root');
        can('route', 'Registration');
        can('route', 'MainMenu');
        can('route', 'Movements');
        can('route', 'MovementDetails');
        can('route', 'Items');
        can('route', 'ItemDetails');
        can('route', 'Operations');
        can('route', 'Profile');
        can('route', 'UploadTest');
        can('route', 'FillTest');
        can('route', 'Stats');
        can('route', 'FileDetails');
        break;
      case 'Manager':
        can('route', 'Root');
        can('route', 'Registration');
        can('route', 'MainMenu');
        can('route', 'Movements');
        can('route', 'MovementDetails');
        can('route', 'Items');
        can('route', 'ItemDetails');
        can('route', 'Operations');
        can('route', 'Profile');
        can('route', 'UploadTest');
        can('route', 'FillTest');
        can('route', 'Stats');
        can('route', 'FileDetails');
        break;
      case 'User':
        can('route', 'Profile');
        break;
    }
  });
}
