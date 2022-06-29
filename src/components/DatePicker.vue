<template>
  <vcal-date-picker
    v-model="date"
    scrollable
    color="primary"
    header-color="primary"
    @input="handleInput"
    :mode="mode"
    :popover="popoverProps"
    :attributes="attributes"
    :select-attribute='selectAttribute'
    ref="dp"
    @popoverWillShow="handleShow"
    @popoverWillHide="handleHide"
  >
    <template v-slot="{ }">
      <v-text-field
        v-model="dateFormatted"
        :label="label"
        prepend-icon="event"
        readonly
        @click="(oldDate = date), (open())"
      ></v-text-field>
    </template>
    <template v-slot:footer>
      <v-btn text color="primary" @click="(date = null), (handleInput()), (close())">
        {{ $t('date_picker.clear') }}
      </v-btn>
      <v-btn text color="primary" @click="(date = oldDate), (handleInput()), (close())">
        {{ $t('date_picker.cancel') }}
      </v-btn>
      <v-btn text color="primary" @click="close()">
        {{ $t('date_picker.ok') }}
      </v-btn>
    </template>
  </vcal-date-picker>
</template>

<script>
import moment from "moment";
import utils from "../utils";

export default {
  props: ["label", "value","mode"],
  data() {
    return {
      date: null,
      oldDate: null,
      dateFormatted: "",
      popoverProps: {
        visibility: 'click',
        keepVisibleOnInput: true
      },
      selectAttribute: {
        highlight: 'blue',
        content: 'black',
      },
      attributes: [
        {
          key: "today",
          highlight: {
            color: 'blue',
            fillMode: 'outline',
          },
          content: 'black',
          dates: new Date(),
        }
      ],
    };
  },
  watch: {
    value() {
      this.date = this.parseDate(this.$props.value);
      this.formatDate();
    }
  },
  methods: {
    open() {
      this.$refs.dp.showPopover();
    },
    close() {
      this.$refs.dp.hidePopover();
    },
    handleShow() {
      if (this.dateFormatted=="")
        this.dateFormatted=" ";
    },
    handleHide() {
      if (this.dateFormatted==" ")
        this.dateFormatted="";
    },
    handleInput() {
      this.formatDate();
      this.emit();
    },
    emit() {
      if (this.date != null)
        this.$emit("input", utils.postgreDate(this.date));
      else
        this.$emit("input", null);
      this.$emit("change");
    },
    formatDate() {
      if (this.date != null)
        this.dateFormatted=this.mode=="dateTime" ? utils.formatDateTime(this.date) : utils.formatDate(this.date);
      else
        this.dateFormatted = "";
    },
    parseDate(date) {
      if (!date) return null;

      return utils.parseDate(date);
    }
  },
  created() {
    this.date = this.parseDate(this.$props.value);
    this.formatDate();
  }
};
</script>

<style scoped>
.date-circle {
  background: '#ff8080';
}
.date-text {
  color: 'black';
}
</style>