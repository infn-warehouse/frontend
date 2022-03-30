<template>
  <div class="fe-navigation">
    <template v-for="item in navigationItems">
      <div :key="item.route" v-if="!('enabled' in item) || item.enabled" :class="{
        navigationItem: true,
        navigationItemSelected: isActive(item.name),
      }">
        <div class="nav-button" v-if="'name' in item" @click="goTo(item.name)">{{item.text}}</div>
        <div class="nav-button" v-if="'callback' in item" @click="item.callback(item)">{{item.text}}</div>
      </div>
    </template>
  </div>
</template>

<script>
import enums from "@/enums";
import { AuthService } from "@/services/auth.service";
import { mapMutations } from "vuex";

export default {
  name: 'Navigation',

  methods: {
    ...mapMutations("snackbar", ["showMessage","closeMessage"]),
    isActive(name) {
      if (!name) return false;
      return this.mapping[this.$route.name] == name;
    },
    goTo(name) {
      this.$router.push({ name }).catch(()=>{});
    }
  },

  computed: {
    enums() {
      return enums;
    }
  },

  data() {
    return {
      mapping: {
        Orders: "Orders",
        OrderDetails: "Orders",
        Movements: "Movements",
        MovementDetails: "Movements",
        Items: "Items",
        ItemDetails: "Items",
        Login: "Login",
        Stats: "Stats",
        Profile: "Profile",
        UploadTest: "UploadTest",
      },
      navigationItems: [
        {
          name: "Orders",
          text: this.$t('navigation.orders')
        },
        {
          name: "Movements",
          text: this.$t('navigation.movements')
        },
        {
          name: "Items",
          text: this.$t('navigation.items')
        },
        {
          name: "Stats",
          text: this.$t('navigation.stats')
        },
        {
          name: "UploadTest",
          text: this.$t('navigation.upload_test'),
          enabled: this.$can("route","UploadTest")
        },
        {
          name: "Profile",
          text: this.$t('navigation.profile'),
          enabled: this.$can("route","Profile")
        },
        {
          callback: async () => {
            await AuthService.logout();
            this.showMessage({
              context: enums.TOAST_TYPE.SUCCESS,
              text: this.$t('toasts.logout_ok')
            });
            this.$router.push({ name: "Login" }).catch(()=>{});
          },
          text: this.$t('navigation.logout')
        }
      ]
    };
  },
};
</script>

<style scoped lang="sass">
.navigationItem
  cursor: pointer
  display: inline-block
  margin-right: 8px
  line-height: 16px
.navigationItemSelected
  background-color: var(--v-secondary-base)
  //border-radius: 0.35em
.nav-button
  padding: 10px
.fe-navigation
  white-space: nowrap
  overflow-x: auto
</style>