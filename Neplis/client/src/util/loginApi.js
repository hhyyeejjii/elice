import axios from "axios";

if (!window.Kakao.isInitialized()) {
  window.Kakao.init('1ae5b25dbdab5980875a7deef78b4e28');
  console.log(window.Kakao.isInitialized());
}

export function kakaoLogin() {
  window.Kakao.Auth.login({
        success: function (authObj) {
          window.Kakao.API.request({
                url: "/v2/user/me",
                success: function (userObj) {
                    let logindata = {     
                        'authinfo' : authObj,
                        'userinfo' : userObj
                    }
                    console.log(logindata);
                    
                    var formData = new FormData();
                    const authinfo = JSON.stringify(authObj)
                    const userinfo = JSON.stringify(userObj)
                    formData.append('authinfo',authinfo);
                    formData.append('userinfo',userinfo);

                    let uri = 'http://elice-kdt-ai-3rd-team03.koreacentral.cloudapp.azure.com/api/oauth'
                    axios.post(uri, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                    })
                    .then((response) => {
                        console.log('res',response.data.access_token);
                        localStorage.setItem('access-token',response.data.access_token)
                    })
                    .catch((error) => {
                        alert(error);
                    })
                },
                fail: function (error) {
                    console.log(error);
                }
            });
        },
        fail: function (err) {
            console.log('에러', err);
            alert('로그인실패!');
        },
    });
}

export function kakaoLogout() {
  if (!window.Kakao.Auth.getAccessToken()){
      console.log("Not logged in");
      return;
  }
  window.Kakao.Auth.logout(function() {
      console.log(window.Kakao.Auth.getAccessToken());
      localStorage.removeItem("access-token")
  })
}

