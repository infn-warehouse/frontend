<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="resourceTypes"
      />
      <MovementForm
        :mode="items.FORM_MODE.UPDATE"
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
    fetch() {
      return GraphileService.fetchOne("MovimentiTemp",["documento"],this.editing_id,"idMovimento");
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