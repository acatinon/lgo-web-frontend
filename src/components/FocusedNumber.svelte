<script>
  export let value;

  let parts;
  let intValue;
  let decValue;
  let disabledValue;

  $: if (value) {
    parts = value.toFormat().split(".");
    intValue = parts[0];
    decValue = parts[1] || "";
    disabledValue = "00000000".substring(0, 8 - decValue.length);
  }
</script>

{#if value}
  {intValue}.{decValue}
  <span class="ui disabled text">{disabledValue}</span>
{/if}
