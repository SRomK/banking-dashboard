<script setup lang="ts">
import { computed } from 'vue'
import type { Account } from '@/types'

const props = defineProps<{
  account: Account
  isLoading?: boolean
}>()

const formattedBalance = computed(() =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: props.account.currency,
  }).format(props.account.balance),
)

const maskedIban = computed(() => {
  const parts = props.account.iban.split(' ')
  return parts.map((p, i) => (i < parts.length - 1 ? '••••' : p)).join(' ')
})

const balanceClass = computed(() =>
  props.account.balance >= 0 ? 'balance--positive' : 'balance--negative',
)
</script>

<template>
  <div class="account-card" :class="{ 'account-card--loading': isLoading }">
    <div v-if="isLoading" class="account-card__skeleton" />
    <template v-else>
      <p class="account-card__owner">{{ account.owner }}</p>
      <p class="account-card__iban">{{ maskedIban }}</p>
      <p class="account-card__balance" :class="balanceClass">
        {{ formattedBalance }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.account-card {
  background: #1a1a2e;
  border-radius: 16px;
  padding: 28px;
  color: #fff;
  min-width: 280px;
}
.account-card--loading {
  min-height: 120px;
}
.account-card__skeleton {
  background: linear-gradient(90deg, #2a2a4a 25%, #3a3a5a 50%, #2a2a4a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  height: 100px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.account-card__owner {
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0 0 4px;
}
.account-card__iban {
  font-size: 0.9rem;
  letter-spacing: 2px;
  margin: 0 0 16px;
  opacity: 0.8;
}
.account-card__balance {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}
.balance--positive { color: #4ade80; }
.balance--negative { color: #f87171; }
</style>
