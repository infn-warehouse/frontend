<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      v-if="logged"
      class="app-bar"
    >
      <div class="nowrap mr-2">
        <button v-if="appMode!=null" class="home-button mr-2" @click="goHome">
          <v-icon large>{{ enums.ICONS.HOME }}</v-icon>
        </button>
        <h3 v-if="appMode==null" class="app-title">
          {{ $t('custom.appname') }}
        </h3>
        <h3 v-if="appMode!=null" class="app-title">
          {{ $t(`choose.choice[${appMode}]`) }}
        </h3>
      </div>

      <v-spacer></v-spacer>
      <LocaleSwitch/>
      <Navigation v-if="appMode!=null"/>
    </v-app-bar>

    <v-main>
      <div class="main-container" fluid>
        <router-view/>
      </div>
      <SnackBar ref="snack" />
    </v-main>
  </v-app>
</template>

<script>
import SnackBar from "./components/SnackBar";
import LocaleSwitch from "./components/LocaleSwitch";
import Navigation from "./Navigation";
import { mapGetters } from "vuex";
import enums from "@/enums";
import StorageService from "@/services/storage.service";

export default {
  name: 'App',

  components: {
    SnackBar,
    Navigation,
    LocaleSwitch,
  },

  computed: {
    ...mapGetters("status", ["logged"]),
    ...mapGetters("info", ["appMode"]),
    enums() {
      return enums;
    }
  },

  created() {
    if (!localStorage.locale) localStorage.locale = "en";
    this.$i18n.locale = localStorage.locale;
  },

  methods: {
    goHome: function() {
      StorageService.removeMode();
      this.$router.push({ name: "MainMenu" }).catch(()=>{});
    }
  },

  data: function() {
    return {
    };
  },
};
</script>

<style>
html {
  overflow-y: hidden !important;
}
.v-main {
  height: 0px;
}
.v-main__wrap {
  overflow-y: scroll;
}
.app-title {
  display: inline-block;
  vertical-align: middle;
}
.home-button {
  vertical-align: middle;
}
</style>
