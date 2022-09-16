<template>
  <div class="app">
    <div v-if="state.account.id">
      안녕하세요? {{ state.account.name }}님
      <button @click="logout()">로그아웃</button>
    </div>
    <div v-else>
      <label for="loginId">
        <span>아이디: </span>
        <input type="text" id="loginId" v-model="state.form.loginId" />
      </label>
      <label for="loginPw" style="margin-left: 10px">
        <span>비밀번호: </span>
        <input type="password" id="loginPw" v-model="state.form.loginPw" />
      </label>
      <hr />
      <button @click="submit()">로그인</button>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue"
import axios from "axios"

export default {
  setup() {
    const state = reactive({
      account: {
        id: null,
        name: "",
      },
      form: {
        loginId: "",
        loginPw: "",
      },
    })

    const submit = () => {
      const args = {
        loginId: state.form.loginId,
        loginPw: state.form.loginPw,
      }
      axios
        .post("/api/account", args)
        .then((응답) => {
          alert("로그인에 성공했습니다.")
          state.account.id = 응답.data.id
          state.account.name = 응답.data.name
        })
        .catch((에러) => {
          alert("로그인에 실패하였습니다. 계정 정보를 확인해주세요. => " + 에러)
        })
    }

    const logout = () => {
      axios.delete("/api/account").then((응답) => {
        console.log(응답)

        alert("로그아웃 했습니다.")
        state.account.id = null
        state.account.name = ""
      })
    }

    async function getApi() {
      await axios.get("/api/account").then((응답) => {
        state.account.id = 응답.data.id
        state.account.name = 응답.data.name
      })
    }

    getApi()

    return { state, submit, logout }
  },
}
</script>
