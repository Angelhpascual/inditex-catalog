import { Phone } from "../../modules/phone/domain/Phone"
import { Link } from "react-router-dom"
import "../../styles/phones.css"

interface PhoneCardProps {
  phone: Phone
}

export const PhoneCard = ({ phone }: PhoneCardProps) => {
  return (
    <div className="phone-card">
      <Link to={`/phones/${phone.id}`}>
        <div className="phone-card__image-container">
          <img
            src={phone.imageUrl}
            alt={phone.name}
            className="phone-card__image"
          />
        </div>
        <div className="phone-card__content">
          <div className="phone-card__info">
            <span className="phone-card__brand">
              {phone.brand.toUpperCase()}
            </span>
            <span className="phone-card__model">
              {phone.name.replace(phone.brand, "").trim().toUpperCase()}
            </span>
          </div>
          <span className="phone-card__price">{phone.basePrice} EUR</span>
        </div>
      </Link>
    </div>
  )
}
