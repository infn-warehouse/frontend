import { defineAbility } from "@casl/ability";

export default function defineAbilitiesFor() {
  /*if (user == null || user.info == null || user.info.role == null) {
    return null;
  }*/
  
  return defineAbility((can) => {
    const role = 'Administrator';

    switch (role) {
      case 'Administrator':
        can('route', 'Movements');
        can('route', 'MovementDetails');
        can('route', 'Profile');
        break;
      case 'Manager':
        can('route', 'Movements');
        can('route', 'MovementDetails');
        can('route', 'Profile');
        break;
      case 'User':
        can('route', 'Profile');
        break;
    }
  });
}
