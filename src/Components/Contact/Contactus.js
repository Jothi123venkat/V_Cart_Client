import React from 'react';
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import './Contactus.css';

const Contactus = () => {
  const onSubmit = (data) => {
    // apiService("posts", data, "unauthpost")
    //   .then((result) => {
    //     getApi();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const { control, handleSubmit, formState } = useForm();

  return (
    <div>
      <div className="mb-5">
        <div
          style={{
            background: "#1C448E",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <h1>Contact us</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="forms">
          <Typography variant="h2" gutterBottom className="text-white">
            Contact us
          </Typography>
          <div>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Maximum length is 20 characters",
                },
              }}
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    fullWidth
                    label="Name"
                    margin="normal"
                    error={!!formState.errors.name}
                    InputLabelProps={{ className: 'text-white' }}
                    InputProps={{ className: 'text-white' }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white',
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                    }}
                  />
                  {formState.errors.name && (
                    <p className="error-message">
                      {formState.errors.name.message}
                    </p>
                  )}
                </>
              )}
            />
            <br />
            <br />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Email is mandatory",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Enter a valid email id",
                },
              }}
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!formState.errors.email}
                    InputLabelProps={{ className: 'text-white' }}
                    InputProps={{ className: 'text-white' }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white',
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                    }}
                  />
                  {formState.errors.email && (
                    <p className="error-message">
                      {formState.errors.email.message}
                    </p>
                  )}
                </>
              )}
            />
            <br />
            <br />
            <Controller
              name="phnum"
              control={control}
              defaultValue=""
              rules={{
                required: "Mobile Number is required",
                maxLength: {
                  value: 10,
                  message: "Only 10 numbers allowed",
                },
              }}
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    fullWidth
                    label="Mobile Number"
                    type="number"
                    error={!!formState.errors.phnum}
                    InputLabelProps={{ className: 'text-white' }}
                    InputProps={{ className: 'text-white' }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white',
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                    }}
                  />
                  {formState.errors.phnum && (
                    <p className="error-message">
                      {formState.errors.phnum.message}
                    </p>
                  )}
                </>
              )}
            />
            <br />
            <br />
            <Controller
              name="message"
              control={control}
              defaultValue=""
              rules={{
                required: "Message is required",
                minLength: {
                  value: 5,
                  message: "Min 5 letters",
                },
                maxLength: {
                  value: 30,
                  message: "Max 30 letters",
                },
              }}
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    label="Message us"
                    type="text"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!formState.errors.message}
                    InputLabelProps={{ className: 'text-white' }}
                    InputProps={{ className: 'text-white' }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white',
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                    }}
                  />
                  {formState.errors.message && (
                    <p className="error-message">
                      {formState.errors.message.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className=' d-flex  justify-content-end  mt-4 '>
          <Button type="submit" variant=' contained'>Submit</Button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Contactus;
