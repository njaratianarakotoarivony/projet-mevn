<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-purple-900 to-violet-800 p-4">
    <div class="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl p-10 border border-white border-opacity-20 shadow-2xl">
      <h2 class="text-3xl font-extrabold text-white text-center mb-8">Connexion</h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <input type="email" placeholder="Email" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500">
        </div>
        <div>
          <input type="password" placeholder="Mot de passe" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500">
        </div>
        <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-xl">
          Se connecter
        </button>
      </form>
      <p class="text-center text-gray-400 mt-8">
        Pas encore de compte ? <a href="#" class="text-white hover:underline">S'inscrire</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  methods: {
    handleLogin() {
      console.log('Tentative de connexion...');
    }
  }
}
</script>
