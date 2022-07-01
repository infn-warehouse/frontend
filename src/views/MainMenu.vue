<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="title"
      />
      <div class="flex-container">
        <v-item-group>
          <v-row>
            <v-col
              v-for="(item, i) in items"
              :key="i"
              cols="12"
              md="4"
            >
              <v-item>
                <v-card @click="handleClick(item)">
                  <div class="menu-label">
                    {{item.label}}
                  </div>
                  <v-img
                    :src="`https://cdn.vuetifyjs.com/images/${item.src}`"
                    height="150"
                    class="text-right pa-2"
                  >
                  </v-img>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </div>
    </v-card>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import helper from "@/mixins/helper";
import enums from "@/enums";
import UserDataService from "@/services/userdata.service";
import StorageService from "@/services/storage.service";

export default {
  name: 'MainMenu',

  components: {
    Toolbar
  },

  mixins: [helper],

  computed: {
    enums() {
      return enums;
    }
  },

  methods: {
    handleClick(item) {
      StorageService.setMode(item.mode);
      this.goToNext();
    },
    goToNext() {
      const startPages = ["Registration","Home"];

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
  },

  async created() {
    this.user=await this.operationWithCheck(async () => await UserDataService.getUserData());
  },
  
  data() {
    return {
      title: this.$t("choose.title"),
      user: {},
      items: [
        {
          src: 'backgrounds/bg.jpg',
          label: this.$t("choose.choice[0]"),
          mode: 0
        },
        {
          src: 'backgrounds/bg.jpg',
          label: this.$t("choose.choice[1]"),
          mode: 1
        },
        {
          src: 'backgrounds/bg.jpg',
          label: this.$t("choose.choice[2]"),
          mode: 2
        },
      ],
    };
  }
};
</script>

<style scoped>

.menu-label {
  margin: 32px;
}

</style>