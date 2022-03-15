<template>
  <div class="my-container">
    <v-card>
      <Toolbar
        :title="title"
      />
      <v-card-text>
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
      </v-card-text>
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
    this.user=await UserDataService.getUserData();
  },
  
  data() {
    return {
      title: this.$t("custom.profile"),
      user: {}
    };
  }
};
</script>
