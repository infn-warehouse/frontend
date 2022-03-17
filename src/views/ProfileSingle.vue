<template>
  <div class="my-container">
    <v-card>
      <Toolbar
        :title="resourceTypes"
      />
      <MovementForm
        :mode="enums.FORM_MODE.UPDATE"
        :selectedItem="item"
        v-if="item"
        @formCancel="handleCancel"
        @formSucceed="_fetch()"
      />
    </v-card>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import helper from "@/mixins/helper";
import singleShared from "@/mixins/singleShared";
import MovementForm from "@/components/forms/MovementForm";
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";

export default {
  name: 'ProfileSingle',

  components: {
    MovementForm,
    Toolbar
  },

  mixins: [helper,singleShared],

  computed: {
    enums() {
      return enums;
    }
  },

  methods: {
    fetch(id) {
      return GraphileService.fetchOne("MovimentiTemp",["documento"],id,"idMovimento");
    },
  },

  data() {
    return {
      resourceTypes: this.$t("resource_types.movements"),
      editing_id: 1
    };
  }
};
</script>
