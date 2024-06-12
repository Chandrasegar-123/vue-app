<template>
  <div class="input-group h-100 mb-3 d-flex align-items-center justify-content-between">
    <input class="form-control" v-model="searchQuery" placeholder="Search..." @input="debouncedUpdateQuery" />
  </div>
</template>

<script>
import { debounce } from '../utils/debounce';

export default {
  name: 'DataTableSearchBar',
  data() {
    return {
      searchQuery: ''
    };
  },
  created() {
    this.debouncedUpdateQuery = debounce(this.updateQuery, 1000);
  },
  methods: {
    updateQuery() {
      this.$emit('update-query', this.searchQuery);
    }
  }
};
</script>
