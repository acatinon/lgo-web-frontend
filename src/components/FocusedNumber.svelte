<script>
  export let value;

  const parts = value.split(".");
  const intValue = parts[0];
  const decValue = parts[1] || "";
  const disabledValue = "00000000".substring(0, 8 - decValue.length);
</script>

{intValue}.{decValue}<span class="ui disabled text">{disabledValue}</span>