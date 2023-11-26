import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 800,
			md: 960,
			lg: 1280,
			xl: 1920,
		},
	},
	palette: {
		mode: "dark",

		primary: {
			main: "#72DDF7",
		},
		secondary: {
			main: "#000",
			light: "#181818",
			dark: "#000",
			contrastText: "#000",
		},
		background: {
			default: "#000",
		},
	},
	typography: {
		fontFamily: ["Poppins", "sans-serif"].join(","),
	},
});

export default theme;
