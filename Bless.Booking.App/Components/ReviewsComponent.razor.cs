using Bless.Proxy;
using Microsoft.AspNetCore.Components;

namespace Bless.Booking.App.Components
{
    public partial class ReviewsComponent: ComponentBase
    {
        [Inject]
        private ReviewsProxy reviewsProxy { get; set; } = default!;


        private List<Bless.Models.Reviews> reviews = new(); // Especificamos el namespace del modelo

        protected override async Task OnInitializedAsync()
        {
            reviews = await reviewsProxy.ObtenerReviewsAsync();
        }
    }
}
