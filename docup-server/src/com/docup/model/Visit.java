/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author elion
 */
@Entity
@Table(name = "visit")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Visit.findAll", query = "SELECT v FROM Visit v"),
    @NamedQuery(name = "Visit.findById", query = "SELECT v FROM Visit v WHERE v.id = :id"),
    @NamedQuery(name = "Visit.findByCreationDate", query = "SELECT v FROM Visit v WHERE v.creationDate = :creationDate"),
    @NamedQuery(name = "Visit.findByLastmodDate", query = "SELECT v FROM Visit v WHERE v.lastmodDate = :lastmodDate"),
    @NamedQuery(name = "Visit.findByTrash", query = "SELECT v FROM Visit v WHERE v.trash = :trash"),
    @NamedQuery(name = "Visit.findByTrashDate", query = "SELECT v FROM Visit v WHERE v.trashDate = :trashDate")})
public class Visit implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "creation_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate;
    @Column(name = "lastmod_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastmodDate;
    @Basic(optional = false)
    @Column(name = "trash")
    private boolean trash;
    @Column(name = "trash_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date trashDate;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "visitId")
    private List<Description> descriptionList;
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Patient patientId;
    @JoinColumn(name = "picture_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Picture pictureId;

    public Visit() {
    }

    public Visit(Integer id) {
        this.id = id;
    }

    public Visit(Integer id, Date creationDate, boolean trash) {
        this.id = id;
        this.creationDate = creationDate;
        this.trash = trash;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Date getLastmodDate() {
        return lastmodDate;
    }

    public void setLastmodDate(Date lastmodDate) {
        this.lastmodDate = lastmodDate;
    }

    public boolean getTrash() {
        return trash;
    }

    public void setTrash(boolean trash) {
        this.trash = trash;
    }

    public Date getTrashDate() {
        return trashDate;
    }

    public void setTrashDate(Date trashDate) {
        this.trashDate = trashDate;
    }

    
    public List<Description> getDescriptionList() {
        return descriptionList;
    }

    public void setDescriptionList(List<Description> descriptionList) {
        this.descriptionList = descriptionList;
    }

    public Patient getPatientId() {
        return patientId;
    }

    public void setPatientId(Patient patientId) {
        this.patientId = patientId;
    }

    public Picture getPictureId() {
        return pictureId;
    }

    public void setPictureId(Picture pictureId) {
        this.pictureId = pictureId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Visit)) {
            return false;
        }
        Visit other = (Visit) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.docup.model.Visit[ id=" + id + " ]";
    }
    
}
