<template>
  <div class="py-5 container bg-light">
    <h1 class="fw-bold display-4 text-center mb-4">Vue Component</h1>
    <div class="row g-3">
      <div v-for="item in items" :key="item.id" class="col-md-6 col-lg-4">
        <div class="shadow-sm card border-0">
          <div class="card-body p-4">
            <span class="badge bg-primary rounded-pill">{{ item.tag }}</span>
            <p class="mt-2 text-muted mb-0">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const items = [
  { id: 1, tag: 'New', text: 'First item' },
  { id: 2, tag: 'Hot', text: 'Second item' },
]
</script>
