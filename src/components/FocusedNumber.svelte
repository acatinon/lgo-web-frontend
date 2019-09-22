<script>
  export let value;
  export let scale;

  let parts;
  let intValue;
  let decValue;
  let disabledValue;

  $: if (value) {
    parts = value.toFormat().split(".");
    intValue = parts[0];
    decValue = parts[1] || "";
    disabledValue = Array(scale + 1).join("0").substring(0, scale - decValue.length);
  }
</script>

{#if value}
  {intValue}.{decValue}<span class="ui disabled text">{disabledValue}</span>
{/if}
