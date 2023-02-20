<template>
  <div class="darkcityx-home">
    <div class="home-main__top">
      <div class="main-top__avatar">
        <img class="top-avatar__img" src="/images/system/avatar.jpg" alt="">
      </div>
      <h3 class="main-top__title">Darkcity_X</h3>
      <div class="main-top__btns">
        <a class="top-btns__item active" href="#">快速开始</a>
        <a class="top-btns__item" href="#">Github</a>
      </div>
    </div>
    <div class="home-main__bottom">
      <div class="main-bottom__title">前言</div>
      <p class="main-bottom__sentence">🍉语句1</p>
      <p class="main-bottom__sentence">🎃语句1</p>
      <div class="main-bottom__title">主要内容</div>
      <p class="main-bottom__sentence">⚡语句1</p>
      <p class="main-bottom__sentence">🌲语句1</p>
      <p class="main-bottom__sentence">🔨语句1</p>
      <p class="main-bottom__sentence">📌语句1</p>
      <p class="main-bottom__sentence">📃语句1</p>
      <p class="main-bottom__sentence">🏆语句1</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.darkcityx-home {
  box-sizing: border-box;
  margin: 40px auto;
  padding: 40px 40px 0;
  max-width: 640px;
  .home-main__top {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .main-top__avatar {
      box-sizing: border-box;
      padding: 6px;
      width: 300px;
      height: 300px;
      border: 2px solid #e5e5e5;
      border-radius: 50%;
      .top-avatar__img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .main-top__title {
      margin: 20px 0;
      font-size: 26px;
      font-weight: bold;
      text-align: center;
    }
    .main-top__btns {
      box-sizing: border-box;
      .top-btns__item {
        box-sizing: border-box;
        margin-right: 20px;
        padding: 4px 34px;
        display: inline-block;
        font-size: 16px;
        border-radius: 4px;
        border: 2px solid transparent;
        background-color: #f5f5f5;
        &:last-child {
          margin-right: 0;
        }
        &.active {
          color: #fff;
          background-color: #2080f0;
        }
        &:hover {
          border-color: #e5e5e5;
        }
      }
    }
  }
  .home-main__bottom {
    margin-top: 50px;
    .main-bottom__title {
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: bold;
    }
    .main-bottom__sentence {
      margin-bottom: 16px;
    }
  }
}
</style>