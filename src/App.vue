<template>
  <div id="app">
    <a-row>
      <a-col
        :xs="24"
        :sm="24"
        :md="{ span: 12, offset: 6 }"
        :lg="{ span: 12, offset: 6 }"
      >
        <a-card class="card">
          <h2>Braille to SVG</h2>
          <div style="margin-bottom: 12px">
            A utility tool for generating SVGs from Braille text
          </div>
          <div>Made by DecayQ</div>
        </a-card>
        <a-card class="card" title="Configuration">
          <a-form :form="form">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="Braille Text">
                  <a-input
                    placeholder="Input here"
                    v-decorator="[
                      'braille',
                      { rules: [{ required: true, message: 'Required' }] },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12">
                <a-form-item label="Background Color">
                  <a-radio-group button-style="solid" v-model="bgColorType">
                    <a-radio-button value="transparent"
                      >Transparent</a-radio-button
                    >
                    <a-radio-button value="color">Use color</a-radio-button>
                  </a-radio-group>
                  <a-input
                    v-if="bgColorType === 'color'"
                    placeholder="Input here"
                    v-decorator="[
                      'bgColor',
                      { initialValue: '#FFFFFF', rules: [{ required: true }] },
                    ]"
                    type="color"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12">
                <a-form-item label="Dot Color">
                  <a-input
                    placeholder="Input here"
                    v-decorator="[
                      'dotColor',
                      { initialValue: '#000000', rules: [{ required: true }] },
                    ]"
                    type="color"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12">
                <a-form-item label="Dot Radius">
                  <a-slider
                    v-decorator="['dotRadius', { initialValue: 3 }]"
                    :min="2"
                    :max="10"
                  ></a-slider>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12">
                <a-form-item label="Character Spacing">
                  <a-slider
                    v-decorator="['charSpacing', { initialValue: 5 }]"
                    :min="2"
                    :max="16"
                  ></a-slider>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item>
                  <a-button
                    type="primary"
                    :loading="generating"
                    @click="generate"
                    >Generate</a-button
                  >
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>

        <a-card title="Preview" class="card">
          <div v-if="svgString" style="padding: 24px">
            <div
              v-html="svgString"
              class="flex justify-center items-center"
              style="margin-bottom: 24px"
            ></div>

            <div class="flex justify-center items-center">
              <a-space>
                <a-button
                  type="default"
                  icon="copy"
                  @click="copyAsImage"
                  :loading="copying"
                  >Copy as image</a-button
                >
                <a-button type="primary" icon="download" @click="downloadSVG"
                  >Download SVG</a-button
                >
              </a-space>
            </div>
          </div>
          <div v-else>Please input braille text and click generate</div>
        </a-card>
      </a-col>
    </a-row>
    <global-footer />
  </div>
</template>

<script>
import { BrailleToSVG, isBrailleString } from "@/utils/Braille";

import GlobalFooter from "./components/GlobalFooter.vue";

export default {
  name: "App",
  components: { GlobalFooter },
  data() {
    return {
      generating: false,
      form: this.$form.createForm(this),
      svgString: "",
      copying: false,
      bgColorType: "transparent",
    };
  },
  methods: {
    generate() {
      this.form
        .validateFields()
        .then((values) => {
          if (isBrailleString(values.braille)) {
            this.generating = true;
            values.backgroundColor =
              this.bgColorType === "transparent"
                ? "transparent"
                : values.bgColor;
            this.svgString = BrailleToSVG(values.braille, values);
            this.generating = false;
          } else {
            this.$message.error("Please input valid braille text");
          }
        })
        .catch((errorInfo) => {
          console.log("Validate Failed:", errorInfo);
        });
    },
    copyAsImage() {
      if (!this.svgString) {
        this.$message.error("No SVG to copy");
        return;
      }
      this.copying = true;
      const svgBlob = new Blob([this.svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (navigator.clipboard && navigator.clipboard.write) {
            navigator.clipboard
              .write([new ClipboardItem({ "image/png": blob })])
              .then(() => {
                this.$message.success("Copied");
                this.copying = false;
              })
              .catch(() => {
                this.$message.error("Failed");
                this.copying = false;
              });
          } else {
            this.$message.error("Clipboard API not supported in this browser");
            this.copying = false;
          }
        });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    downloadSVG() {
      if (!this.svgString) {
        this.$message.error("No SVG to download");
        return;
      }
      const blob = new Blob([this.svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "braille.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style lang="less">
#app {
  min-height: 100vh;
  padding: 18px;
  background: #e8e8e8;
}

.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.items-center {
  align-items: center;
}
.text-center {
  text-align: center;
}

.card {
  border-radius: @border-radius-base !important;
  margin-bottom: 24px !important;
}
</style>
