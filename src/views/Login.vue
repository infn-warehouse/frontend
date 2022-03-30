<template>
  <v-container class="fixed-container">
    <v-row>
      <v-col cols="12">
        <LocaleSwitch/>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" align="center">
        <font color="white" size="5">{{ $t('login.before') }}<b>{{ $t('custom.appname') }}</b>{{ $t('login.after') }}</font>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="12" align="center">
        <img style="background-color: white;" :src="require('../assets/infn-lns-logo.png')" class="fixed-content-2" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col align="center" cols="12">
        <v-form class="fixed-content">
          <v-text-field
            :label="$t('login.email')"
            v-model="email"
            required
            dark
            @keyup.enter.native="submit"
          ></v-text-field>
          <v-text-field
            :label="$t('login.password')"
            v-model="password"
            required
            dark
            :append-icon="showPassword ? 'visibility' : 'visibility_off'"
            @click:append="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
            @keyup.enter.native="submit"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" align="center">
        <v-btn large :loading="loading" :disabled="loading" @click="submit">
          <font color="secondary">{{$t('buttons.login')}}</font>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import enums from "@/enums";
import { mapMutations } from "vuex";
import { AuthService } from "@/services/auth.service";
import LocaleSwitch from "@/components/LocaleSwitch";

export default {
  components: {
    LocaleSwitch
  },
  data: () => ({
    email: "",
    password: "",
    showPassword: false,
    loading: false,
  }),
  methods: {
    ...mapMutations("snackbar", ["showMessage","closeMessage"]),
    goToNext() {
      const startPages = ["Movements", "Home"];

      let found = false;
      for (const r of startPages) {
        if (this.$can("route", r)) {
          this.$router.push({ name: r }).catch(()=>{});
          found = true;
          break;
        }
      }
      if (!found) this.$router.push({ name: "default" }).catch(()=>{});
    },
    async submit() {
      const res=await AuthService.login(this.email, this.password);
      if (res.error) {
        this.showMessage({
          context: enums.TOAST_TYPE.ERROR,
          text: res.error
        });
      }
      else {
        this.showMessage({
          context: enums.TOAST_TYPE.SUCCESS,
          text: this.$t('toasts.login_ok')
        });
        this.goToNext();
      }
      /*this.$confirm({
        message: "prova",
        button: {
          no: this.$t('confirm.no'),
          yes: this.$t('confirm.yes')
        },
        callback: async confirm => {
          if (confirm) {
          }
        }
      });*/

    }
  },
  computed: {
    enums() {
      return enums;
    }
  }
}
</script>

<style scoped>
.container {
  background: #7389ae;
  width: 50%;
}
</style>