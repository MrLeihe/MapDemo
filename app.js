//app.js
App({
  onLaunch: function () {
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.requestUserInfo();
        }else{
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              that.requestUserInfo();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '获取用户信息失败',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {
                        if (res.authSetting['scope.userLocation']) {
                          that.requestUserInfo();
                        } else {
                          consoleUtil.log('用户未同意获取用户信息权限');
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  requestUserInfo: function(){
    var that = this;
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        that.globalData.userInfo = res.userInfo;

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res);
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    header: {
      'Cookie': '',
      'content-type': 'application/json'
    },
  }
})