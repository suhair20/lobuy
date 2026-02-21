import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';


const BASE_URL =
  import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://phonefix-i73f.onrender.com";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export const userSlice= createApi({
    reducerPath:"userapi",
    baseQuery,
    endpoints:(builder)=>({



        signup:builder.mutation({
            query:(data)=>({
                url:'/api/user/register',
                method:'POST',
                body:data
            })
        }),



        verifyOtp:builder.mutation({
            query:(data)=>({
                url:'/api/user/verifyotp',
                method:'POST',
                body:data
            })
        }),

        checkAuth:builder.query({
            query:()=>({
                url:'/api/user/UserCheckAuth',
                method:'GET',
                   credentials: "include" 

            })
        }),
        

        login:builder.mutation({
            query:(data)=>({
                url:'/api/user/login',
                method:'POST',
                body:data
            })
        }),

addAddress: builder.mutation({
  query: (data) => ({
    url: "/api/user/addaddress",
    method: "POST",
    body:data,
    credentials: "include",
  }),
}),

GetProductByIdQuery:builder.query({
    query:(id)=>({
   url:`/api/user/productbyId/${id}`,
   method:"GET",
   credentials:"include"
    })
}),




        getAddress: builder.query({
         query: () => ({
          url: "/api/user/get-address",
          method:'GET',
         credentials: "include",
                  })
         }),



         getLatestProducts:builder.query({
         query:(limit=5)=>({
         url:`/api/user/products/latest?limit=${limit}`,
         method:'GET',
         credentials:"include"
         })

         }),

         getCategories: builder.query({
          query: () => ({
         url: "/api/user/categories",
          method: "GET",
            }),
}),


        GetProductsByCategory:builder.query({
            query:(id)=>({
               url:`/api/user/productbycategory/${id}`,
               method:"GET"  
            })
        }),

        
        checkout:builder.mutation({
            query:(data)=>({
                url:'/api/user/checkout',
                method:'POST',
                body:data
            })
        }),

         GetCart: builder.query({
         query: () => "/api/user/cart",
          providesTags: ["Cart"],
      }),
   




AddToCart: builder.mutation({
  query: ({ productId, quantity }) => ({
    url: "/api/user/cart/add",
    method: "POST",
    body: { productId, quantity },
  }),
  invalidatesTags: ["Cart"],
}),






UpdateCart: builder.mutation({
  query: ({ productId, quantity }) => ({
    url: "/api/user/cart/update",
    method: "PUT",
    body: { productId, quantity },
  }),
  invalidatesTags: ["Cart"],
}),




RemoveFromCart: builder.mutation({
  query: (productId) => ({
    url: `/api/user/cart/remove/${productId}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Cart"],
}),

createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/api/user/orders', 
        method:'POST',
        body: orderData,
      }),
      
      invalidatesTags: ['Cart'], 
    }),

  verifyPayment: builder.mutation({     
  query: (paymentDetails) => ({
    url: '/api/user/orders/verify', 
    method: 'POST',
    body: paymentDetails,
  }),
}),

getMyOrders: builder.query({
      query: () => ({
        url: '/api/user/my-orders',
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `/api/user/orders-deatials/${id}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    cancelOrder: builder.mutation({
  query: (id) => ({
    url: `/api/user/orders/${id}/cancel`,
    method: 'PATCH', 
  }),
  invalidatesTags: ['Order'], 
}),

logoutApi: builder.mutation({
      query: () => ({
        url: '/api/user/logout',
        method: 'POST',
      }),
    }),





    })
    
})

export const {

    useSignupMutation,
    useVerifyOtpMutation,
    useCheckAuthQuery,
    useLoginMutation,
    useGetAddressQuery,
    useAddAddressMutation   ,
    useGetLatestProductsQuery,
    useGetProductByIdQueryQuery,
    useGetCategoriesQuery,
    useGetProductsByCategoryQuery,
    useCheckoutMutation,
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartMutation,
    useRemoveFromCartMutation,
    useCreateOrderMutation,
    useVerifyPaymentMutation,
    useGetMyOrdersQuery,
    useGetOrderDetailsQuery,
    useCancelOrderMutation,
    useLogoutApiMutation

}=userSlice   