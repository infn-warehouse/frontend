<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="title"
      />
      <div class="flex-container">
        <v-text-field
          :label="$t('custom.email')"
          v-model="user.email"
          :disabled="true"
        ></v-text-field>
        <v-text-field
          :label="$t('custom.role')"
          v-model="user.role"
          :disabled="true"
        ></v-text-field>
      </div>
    </v-card>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import helper from "@/mixins/helper";
import enums from "@/enums";
import UserDataService from "@/services/userdata.service";

export default {
  name: 'Profile',

  components: {
    Toolbar
  },

  mixins: [helper],

  computed: {
    enums() {
      return enums;
    }
  },
  async created() {
    this.user=await this.operationWithCheck(async () => await UserDataService.getUserData());
  },
  
  data() {
    return {
      title: this.$t("custom.profile"),
      user: {}
    };
  }
};
</script>
