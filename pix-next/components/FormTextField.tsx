"use client";
import { TextField } from "@mui/material";
interface FormTextFieldProps {
	id: string;
	name: string;
	label: string;
	value: string;
	type?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
	error: boolean;
	helperText: string | undefined | boolean;
}
const FormTextField = ({
	id,
	name,
	label,
	value,
	type,
	onChange,
	onBlur,
	error,
	helperText,
}: FormTextFieldProps) => {
	return (
		<TextField
			fullWidth
			id={id}
			name={name}
			label={label}
			type={type ? type : "text"}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			error={error}
			helperText={helperText}
			color="secondary"
			sx={{
				"& .MuiOutlinedInput-root": {
					borderRadius: "5rem",
                    "&:hover fieldset": {
                        borderColor: "#000"
                    },
					"& fieldset": {
                        borderColor: "#444",
                    },
				},
				"& .MuiFocused": {
					borderColor: "#f50057 !important",
				},
			}}
			InputLabelProps={{
				sx: {
					color: "#000",
					fontSize: {xs: "0.8rem", sm: "0.9rem"}
				},
			}}
			inputProps={{
				sx: {
					color: "#000",
					padding: {xs: "0.8rem", sm: "1rem"},
					
				},
			}}
		/>
	);
};

export default FormTextField;
