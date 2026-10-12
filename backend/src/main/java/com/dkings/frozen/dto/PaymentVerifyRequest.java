package com.dkings.frozen.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentVerifyRequest {

    @NotBlank(message = "Payment reference is required")
    private String reference;

    public PaymentVerifyRequest() {
    }

    public PaymentVerifyRequest(String reference) {
        this.reference = reference;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }
}
