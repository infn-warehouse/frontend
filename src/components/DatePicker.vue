<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateFormatted"
        :label="label"
        prepend-icon="event"
        readonly
        v-bind="attrs"
        v-on="on"
        @click="(oldDate = date)"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      scrollable
      color="primary"
      header-color="primary"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="(date = null), (menu = false)">
        {{ $t('date_picker.clear') }}
      </v-btn>
      <v-btn text color="primary" @click="(date = oldDate), (menu = false)">
        {{ $t('date_picker.cancel') }}
      </v-btn>
      <v-btn text color="primary" @click="menu = false">
        {{ $t('date_picker.ok') }}
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import moment from "moment";

export default {
  props: ["label", "value"],
  data() {
    return {
      date: {
        content: null
      },
      oldDate: null,
      dateFormatted: "",
      menu: false,
      opened: false
    };
  },
  watch: {
    menu() {
      if (this.menu) {
        if (this.dateFormatted=="")
          this.dateFormatted=" ";
      }
      else {
        if (this.dateFormatted==" ")
          this.dateFormatted="";
      }
    },
    date() {
      if (this.date != null) {
        this.dateFormatted = this.formatDate(this.date);
        this.$emit("input", moment.utc(this.date).format());
      } else {
        this.dateFormatted = "";
        this.$emit("input", null);
      }
    },
    value() {
      this.date = this.parseDate(this.$props.value);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      return moment(String(date)).format("DD/MM/YYYY");
    },
    parseDate(date) {
      if (!date) return null;

      return moment(String(date)).format("YYYY-MM-DD");
    }
  },
  created() {
    this.date = this.parseDate(this.$props.value);
  }
};
</script>
