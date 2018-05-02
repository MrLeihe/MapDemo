// pages/chooseAddress/chooseAddress.js


//获取应用实例
const app = getApp();
var consoleUtil = require('../../utils/consoleUtil.js');
var constant = require('../../utils/constant.js');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var windowHeight;
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContentHeight: '0px',
    resultList: [],
    //输入绑定同时显示隐藏删除按钮
    inputAddress: '',
    city: '',
    street: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      city: options.city,
      street: options.street
    })
    consoleUtil.log('city--->' + that.data.city + '---street--->' + that.data.street);
    that.getSearchContentHeight();
    that.loadSdk();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  onReady: function () {
    //默认按照当前street(街道)搜索
    this.suggestionSearch(this.data.street);
  },

  /**
   * 初始化sdk
   */
  loadSdk: function () {
    qqmapsdk = new QQMapWX({
      key: constant.tencentAk
    });
  },

  /**
   * 获取内容视图高度
   */
  getSearchContentHeight: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight;
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#input-address-layout').boundingClientRect();
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          that.setData({
            searchContentHeight: (windowHeight - res[0].height) + 'px'
          })
        })
      },
    })
  },

  /**
   * 绑定输入框
   */
  bindAddressInput: function (e) {
    var that = this;
    consoleUtil.log(e.detail.value);
    that.setData({
      inputAddress: e.detail.value,
    })
    if (e.detail.value){
      that.suggestionSearch(e.detail.value);
    }else{
      that.suggestionSearch(that.data.street);
    }
  },

  /**
   * 热词检索
   */
  suggestionSearch: function (searchValue) {
    var that = this;
    consoleUtil.log(qqmapsdk);
    qqmapsdk.getSuggestion({
      keyword: searchValue,
      region: that.data.city,
      region_fix: 1,
      policy: 1,
      success: function (res) {
        console.log(res.data);
        that.setData({
          resultList: res.data
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 删除输入内容
   */
  deleteInput: function () {
    this.setData({
      inputAddress: '',
    })
    that.suggestionSearch(that.data.street);
  },

  /**
   * item点击事件,将地址回调到地图页面
   */
  itemAddressClick: function(e){
    var that = this;
    consoleUtil.log(e);
    consoleUtil.log(e.currentTarget.id);
    var item = that.data.resultList[Number(e.currentTarget.id)];
    consoleUtil.log(item);
    //将数据设置到地图页面
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    prePage.setData({
      callbackAddressInfo: item
    })
    wx.navigateBack({
      
    })
  },
})