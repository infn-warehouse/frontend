<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="title"
      />
      <div class="flex-container">
        <v-text-field
          label="Numero"
          v-model="vars.Numero"
        ></v-text-field>
        <v-text-field
          label="Data"
          v-model="vars.Data"
        ></v-text-field>
        <v-text-field
          label="Prelevante"
          v-model="vars.Prelevante"
        ></v-text-field>
        <v-text-field
          label="Gruppo"
          v-model="vars.Gruppo"
        ></v-text-field>
        <v-btn
          @click="fill()"
          color="primary"
        >
          {{ $t('buttons.fill') }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import helper from "@/mixins/helper";
import enums from "@/enums";
import { FillService } from "@/services/fill.service";

export default {
  name: 'FillTest',

  components: {
    Toolbar,
  },

  mixins: [helper],

  computed: {
    enums() {
      return enums;
    }
  },
  async created() {
  },
  
  methods: {
    async fill() {
      let data=await FillService.fill("Prelevamento",this.vars);
      var file = new Blob([data], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  },

  data() {
    return {
      title: this.$t("custom.fill_test"),
      vars: {
        Numero: "",
        Data: "",
        Prelevante: "",
        Gruppo: "",
      }
    };
  }
};
</script>
